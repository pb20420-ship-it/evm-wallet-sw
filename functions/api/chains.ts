/**
 * Cloudflare Pages Function for /api/chains endpoint
 * Returns supported chains configuration
 */

const CHAIN_CONFIG: Record<number, { name: string; symbol: string; blockExplorer: string; rpc?: string }> = {
  // Ethereum
  1: {
    name: 'Ethereum',
    symbol: 'ETH',
    blockExplorer: 'https://etherscan.io',
  },
  11155111: {
    name: 'Sepolia Testnet',
    symbol: 'ETH',
    blockExplorer: 'https://sepolia.etherscan.io',
  },

  // Layer 2s
  10: {
    name: 'Optimism',
    symbol: 'ETH',
    blockExplorer: 'https://optimistic.etherscan.io',
  },
  42161: {
    name: 'Arbitrum One',
    symbol: 'ETH',
    blockExplorer: 'https://arbiscan.io',
  },
  8453: {
    name: 'Base',
    symbol: 'ETH',
    blockExplorer: 'https://basescan.org',
  },

  // Sidechains
  137: {
    name: 'Polygon',
    symbol: 'MATIC',
    blockExplorer: 'https://polygonscan.com',
  },
  43114: {
    name: 'Avalanche C-Chain',
    symbol: 'AVAX',
    blockExplorer: 'https://snowscan.xyz',
  },
  56: {
    name: 'BNB Smart Chain',
    symbol: 'BNB',
    blockExplorer: 'https://bscscan.com',
  },

  // Other EVM Chains
  250: {
    name: 'Fantom',
    symbol: 'FTM',
    blockExplorer: 'https://ftmscan.com',
  },
  42220: {
    name: 'Celo',
    symbol: 'CELO',
    blockExplorer: 'https://celoscan.io',
  },
  1313161554: {
    name: 'Aurora',
    symbol: 'ETH',
    blockExplorer: 'https://explorer.aurora.dev',
  },
  25: {
    name: 'Cronos',
    symbol: 'CRO',
    blockExplorer: 'https://cronoscan.com',
  },
  1101: {
    name: 'Polygon zkEVM',
    symbol: 'ETH',
    blockExplorer: 'https://zkevm.polygonscan.com',
  },
  324: {
    name: 'zkSync Era',
    symbol: 'ETH',
    blockExplorer: 'https://explorer.zksync.io',
  },
  59144: {
    name: 'Linea',
    symbol: 'ETH',
    blockExplorer: 'https://lineascan.build',
  },
  534352: {
    name: 'Scroll',
    symbol: 'ETH',
    blockExplorer: 'https://scrollscan.com',
  },
  100: {
    name: 'Gnosis Chain',
    symbol: 'xDAI',
    blockExplorer: 'https://gnosisscan.io',
  },
  128: {
    name: 'Huobi ECO Chain',
    symbol: 'HT',
    blockExplorer: 'https://hecoinfo.com',
  },
  66: {
    name: 'OKX Chain',
    symbol: 'OKT',
    blockExplorer: 'https://www.oklink.com/okc',
  },
  1666600000: {
    name: 'Harmony One',
    symbol: 'ONE',
    blockExplorer: 'https://explorer.harmony.one',
  },
  122: {
    name: 'Fuse',
    symbol: 'FUSE',
    blockExplorer: 'https://explorer.fuse.io',
  },
  1284: {
    name: 'Moonbeam',
    symbol: 'GLMR',
    blockExplorer: 'https://moonscan.io',
  },
  1285: {
    name: 'Moonriver',
    symbol: 'MOVR',
    blockExplorer: 'https://moonriver.moonscan.io',
  },
  361: {
    name: 'Theta',
    symbol: 'THETA',
    blockExplorer: 'https://explorer.thetatoken.org',
  },
  1030: {
    name: 'Conflux eSpace',
    symbol: 'CFX',
    blockExplorer: 'https://evm.confluxscan.io',
  },
  2000: {
    name: 'Dogechain',
    symbol: 'DOGE',
    blockExplorer: 'https://explorer.dogechain.dog',
  },
  7700: {
    name: 'Canto',
    symbol: 'CANTO',
    blockExplorer: 'https://evm.explorer.canto.io',
  },
  1088: {
    name: 'Metis Andromeda',
    symbol: 'METIS',
    blockExplorer: 'https://andromeda-explorer.metis.io',
  },
  33: {
    name: 'Aves',
    symbol: 'AVES',
    blockExplorer: 'https://explorer.avescoin.io',
  },
  4689: {
    name: 'IoTeX',
    symbol: 'IOTX',
    blockExplorer: 'https://iotexscan.io',
  },
  9001: {
    name: 'Evmos',
    symbol: 'EVMOS',
    blockExplorer: 'https://escan.live',
  },
  322: {
    name: 'KCC',
    symbol: 'KCS',
    blockExplorer: 'https://explorer.kcc.io',
  },
  1116: {
    name: 'Core',
    symbol: 'CORE',
    blockExplorer: 'https://explorer.coredao.org',
  },
};

const SUPPORTED_CHAIN_IDS = Object.keys(CHAIN_CONFIG).map(Number);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

export const onRequest: PagesFunction = async (context) => {
  const { request } = context;

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  if (request.method === 'GET') {
    const chains = SUPPORTED_CHAIN_IDS.map((chainId) => ({
      chainId,
      ...CHAIN_CONFIG[chainId],
      contractDeployed: false, // TODO: Check actual deployment status
    }));

    return new Response(JSON.stringify(chains), {
      headers: corsHeaders,
    });
  }

  return new Response(
    JSON.stringify({ error: 'Method not allowed' }),
    {
      status: 405,
      headers: corsHeaders,
    }
  );
};
