import axios from '../utils/axios_utils';

interface funData {
  params: [];
}
export const get_aptos_acct_by_github_acct = (data: funData) =>
  axios.post('/api/v1/run?name=DID.Indexer&func_name=get_aptos_acct_by_github_acct', data);

export const get_module_doc = (data: funData) =>
  axios.post('/api/v1/run?name=DID.Indexer&func_name=get_module_doc', data);
