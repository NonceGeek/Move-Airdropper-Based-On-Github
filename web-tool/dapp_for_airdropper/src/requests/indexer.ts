import axios from '../utils/axios_utils';

export const get_aptos_acct_by_github_acct = async (githubIds: string[]) => {
    const data = {
        "params": [githubIds]
    }
    let res = await axios.post('/api/v1/run?name=DID.Indexer&func_name=get_aptos_accts_by_github_accts', data);
    return res;
}
