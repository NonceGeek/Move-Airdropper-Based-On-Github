import axios from '../utils/axios_utils';

export const get_aptos_acct_by_github_acct = async (githubId: string) => {
    const data = {
        "params": [githubId]
    }
    let res = await axios.post('/api/v1/run?name=DID.Indexer&func_name=get_aptos_acct_by_github_acct', data);
    return res;
    console.log(res);
}