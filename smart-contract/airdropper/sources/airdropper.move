module my_addr::airdropper {
    use aptos_framework::coin;
    use aptos_framework::timestamp;
    use aptos_framework::account;
    use aptos_framework::account::SignerCapability;
    use aptos_framework::guid;

    use std::error;
    use std::signer;
    use std::vector;
    use std::option::Option;
    use std::string::{String};

    use aptos_std::event::{Self, EventHandle};
    use aptos_std::table::{Self, Table};

    use aptos_token::token::{Token, TokenId};

    const EAIRDROP_NOT_EXIST: u64 = 1;
    const EINVALID_OWNER: u64 = 2;
    const EOWNER_NOT_HAVING_ENOUGH_COIN: u64 = 3;
    const EOWNER_NOT_HAVING_ENOUGH_TOKEN: u64 = 4;
    const EAIRDROPER_NOT_RECEIVER: u64 = 5;
    const ERROR_NOT_ENOUGH_LENGTH: u64 = 6;

    struct AirdropCap has key {
		cap: SignerCapability,
	}

    struct AirdropCoinEvent has drop, store {
        sender_address: address,
        description: String,
        coin_amount: u64,
        timestamp: u64,
        receiver_address: address,
    }

    struct AirdropTokenEvent has drop, store {
        airdrop_id: u64,
        sender_address: address,
        token_id: TokenId,
        amount: u64,
        timestamp: u64,
        receiver_address: address,
    }

    struct ClaimTokenEvent has drop, store {
        airdrop_id: u64,
        sender_address: address,
        token_id: TokenId,
        amount: u64,
        timestamp: u64,
        claimer_address: address,
    }

    struct AirdropTokenItem has store {
        airdrop_id: u64,
        locked_token: Option<Token>,
        timestamp: u64,
        sender_address: address,
        receiver_address: address,
    }

    struct AirdropItemsData has key {
        airdrop_items: Table<u64, AirdropTokenItem>,
        airdrop_coin_events: EventHandle<AirdropCoinEvent>,
        airdrop_token_events: EventHandle<AirdropTokenEvent>,
        claim_token_events: EventHandle<ClaimTokenEvent>,
    }

    // get signer unique id for airdrop
    fun get_unique_airdrop_id() : u64 acquires AirdropCap {
        let airdrop_cap = &borrow_global<AirdropCap>(@my_addr).cap;
        let airdrop_signer = &account::create_signer_with_capability(airdrop_cap);
        let guid = account::create_guid(airdrop_signer);
        let airdrop_id = guid::creation_num(&guid);

        airdrop_id
    }

    fun get_airdrop_signer_address() : address acquires AirdropCap {
        let airdrop_cap = &borrow_global<AirdropCap>(@my_addr).cap;
        let airdrop_signer = &account::create_signer_with_capability(airdrop_cap);
        let airdrop_signer_address = signer::address_of(airdrop_signer);

        airdrop_signer_address
    }

    // call after you deploy
    public entry fun initialize_script(sender: &signer) {
        let sender_addr = signer::address_of(sender);

        assert!(sender_addr == @my_addr, error::invalid_argument(EINVALID_OWNER));

        let (airdrop_signer, airdrop_cap) = account::create_resource_account(sender, x"01");
		let airdrop_signer_address = signer::address_of(&airdrop_signer);

		if(!exists<AirdropCap>(@my_addr)){
            move_to(sender, AirdropCap {
                cap: airdrop_cap
            })
		};

        if (!exists<AirdropItemsData>(airdrop_signer_address)) {
            move_to(&airdrop_signer, AirdropItemsData {
                airdrop_items: table::new(),
                airdrop_coin_events: account::new_event_handle<AirdropCoinEvent>(&airdrop_signer),
                airdrop_token_events: account::new_event_handle<AirdropTokenEvent>(&airdrop_signer),
                claim_token_events: account::new_event_handle<ClaimTokenEvent>(&airdrop_signer),
            });
		};
    }

    fun airdrop_coin<CoinType>(
        sender: &signer,
        description: String,
        receiver: address,
        amount: u64,
    ) acquires AirdropCap, AirdropItemsData {
        let sender_addr = signer::address_of(sender);
        let airdrop_signer_address = get_airdrop_signer_address();
        let airdrop_items_data = borrow_global_mut<AirdropItemsData>(airdrop_signer_address);

        // transfer
        coin::transfer<CoinType>(sender, receiver, amount);

        event::emit_event<AirdropCoinEvent>(
            &mut airdrop_items_data.airdrop_coin_events,
            AirdropCoinEvent { 
                receiver_address: receiver,
                description: description,
                sender_address: sender_addr,
                coin_amount: amount,
                timestamp: timestamp::now_seconds(),
            },
        );
    }

    public entry fun airdrop_coins_average_script<CoinType>(
        sender: &signer,
        description: String,
        receivers: vector<address>,
        uint_amount: u64,
    ) acquires AirdropCap, AirdropItemsData {
        let sender_addr = signer::address_of(sender);
        let length_receiver = vector::length(&receivers);
        // TODO [x] valid sender has enough coin
        assert!(coin::balance<CoinType>(sender_addr) >= length_receiver * uint_amount, error::invalid_argument(EOWNER_NOT_HAVING_ENOUGH_COIN));

        let i = length_receiver;

        while (i > 0) {
            let receiver_address = vector::pop_back(&mut receivers);
            airdrop_coin<CoinType>(sender, description, receiver_address, uint_amount);

            i = i - 1;
        }
    }

    public entry fun airdrop_coins_not_average_script<CoinType>(
        sender: &signer,
        description: String, 
        receivers: vector<address>,
        amounts: vector<u64>,
    ) acquires AirdropCap, AirdropItemsData {
        let sender_addr = signer::address_of(sender);
        let length_receiver = vector::length(&receivers);
        let length_amounts = vector::length(&amounts);

        assert!(length_receiver == length_amounts, ERROR_NOT_ENOUGH_LENGTH);

        let y = length_amounts;

        // get total amount
        let total_amount = 0;
        let calculation_amounts = amounts;

        while (y > 0) {
            let amount = vector::pop_back(&mut calculation_amounts);
            total_amount = total_amount + amount;
            y = y - 1;
        };

        // TODO [x] valid sender has enough coin
        assert!(coin::balance<CoinType>(sender_addr) >= total_amount, error::invalid_argument(EOWNER_NOT_HAVING_ENOUGH_COIN));

        let i = length_receiver;

        while (i > 0) {
            let receiver_address = vector::pop_back(&mut receivers);
            let amount = vector::pop_back(&mut amounts);
            airdrop_coin<CoinType>(sender, description, receiver_address, amount);

            i = i - 1;
        }
    }

    #[test(aptos_framework = @0x1, airdrop = @my_addr, sender = @0xAE)]
    public fun test_initialize_script(airdrop: &signer) {
        account::create_account_for_test(signer::address_of(airdrop));
        initialize_script(airdrop);
    }

    #[test(aptos_framework = @0x1, airdrop = @my_addr, sender = @0xAE, receiver_1 = @0xAF, receiver_2 = @0xB0)]
    public fun test_airdrop_coins_average_script(aptos_framework: &signer, airdrop: &signer, sender: &signer, receiver_1: &signer, receiver_2: &signer) acquires AirdropCap, AirdropItemsData {
        // set timestamp
        timestamp::set_time_has_started_for_testing(aptos_framework);

        // create account
        account::create_account_for_test(signer::address_of(aptos_framework));
        account::create_account_for_test(signer::address_of(airdrop));
        account::create_account_for_test(signer::address_of(sender));
        account::create_account_for_test(signer::address_of(receiver_1));
        account::create_account_for_test(signer::address_of(receiver_2));

        coin::create_fake_money(aptos_framework, sender, 300);
        coin::transfer<coin::FakeMoney>(aptos_framework, signer::address_of(sender), 300);

        coin::register<coin::FakeMoney>(receiver_1);
        coin::register<coin::FakeMoney>(receiver_2);

        initialize_script(airdrop);

        airdrop_coins_average_script<coin::FakeMoney>(
            sender,
            b"test",
            vector<address>[signer::address_of(receiver_1), signer::address_of(receiver_2)],
            150,
        );

        assert!(coin::balance<coin::FakeMoney>(signer::address_of(sender)) == 0, 1);
        assert!(coin::balance<coin::FakeMoney>(signer::address_of(receiver_1)) == 150, 1);
        assert!(coin::balance<coin::FakeMoney>(signer::address_of(receiver_2)) == 150, 1);
    }

    #[test(aptos_framework = @0x1, airdrop = @my_addr, sender = @0xAE, receiver_1 = @0xAF, receiver_2 = @0xB0)]
    public fun test_airdrop_coins_not_average_script(aptos_framework: &signer, airdrop: &signer, sender: &signer, receiver_1: &signer, receiver_2: &signer) acquires AirdropCap, AirdropItemsData {
        // set timestamp
        timestamp::set_time_has_started_for_testing(aptos_framework);

        // create account
        account::create_account_for_test(signer::address_of(aptos_framework));
        account::create_account_for_test(signer::address_of(airdrop));
        account::create_account_for_test(signer::address_of(sender));
        account::create_account_for_test(signer::address_of(receiver_1));
        account::create_account_for_test(signer::address_of(receiver_2));

        coin::create_fake_money(aptos_framework, sender, 300);
        coin::transfer<coin::FakeMoney>(aptos_framework, signer::address_of(sender), 300);

        coin::register<coin::FakeMoney>(receiver_1);
        coin::register<coin::FakeMoney>(receiver_2);

        initialize_script(airdrop);

        airdrop_coins_not_average_script<coin::FakeMoney>(
            sender,
            b"test",
            vector<address>[signer::address_of(receiver_1), signer::address_of(receiver_2)],
            vector<u64>[100, 200],
        );

        assert!(coin::balance<coin::FakeMoney>(signer::address_of(sender)) == 0, 1);
        assert!(coin::balance<coin::FakeMoney>(signer::address_of(receiver_1)) == 100, 1);
        assert!(coin::balance<coin::FakeMoney>(signer::address_of(receiver_2)) == 200, 1);
    }
}