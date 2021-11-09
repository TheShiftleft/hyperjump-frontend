import axios from 'axios'
import { VAULTS_API_URL } from 'config'
import { VaultApyData } from 'state/types'

const fetchVaultApysData = async (): Promise<VaultApyData> => {
    try {
        const res = await axios.get(`${VAULTS_API_URL}/apy?_=1618245423`)
        return res.data
    } catch (e) {
        console.error(e)
        return {}
    }
}

export default fetchVaultApysData