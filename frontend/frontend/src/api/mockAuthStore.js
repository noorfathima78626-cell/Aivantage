// Stand-in "backend" for local dev, so register/login behave like the real
// thing while MOCK_MODE is on: accounts persist in localStorage (survives
// page reloads), registering with a taken email/phone is rejected, and
// logging in checks against what was actually registered. Delete this file
// once MOCK_MODE is false and real backend calls take over - nothing else
// needs to change since Login.jsx/Register.jsx already call authApi the
// same way either mode.
const STORAGE_KEY = 'vantage_mock_accounts'

function readAccounts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  } catch {
    return []
  }
}

function writeAccounts(accounts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts))
}

export function mockRegister({ name, dob, email, phone, password }) {
  const accounts = readAccounts()

  if (accounts.some((a) => a.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('An account with this email already exists — try logging in instead.')
  }
  if (accounts.some((a) => a.phone === phone)) {
    throw new Error('An account with this phone number already exists.')
  }

  const account = { id: accounts.length + 1, name, dob, email, phone, password }
  writeAccounts([...accounts, account])

  return {
    token: 'mock-token-' + account.id,
    user: { id: account.id, name: account.name, email: account.email },
  }
}

export function mockLogin({ email, password }) {
  const accounts = readAccounts()
  const account = accounts.find((a) => a.email.toLowerCase() === email.toLowerCase())

  if (!account) {
    throw new Error('No account found with that email — try registering first.')
  }
  if (account.password !== password) {
    throw new Error('Incorrect password for this account.')
  }

  return {
    token: 'mock-token-' + account.id,
    user: { id: account.id, name: account.name, email: account.email },
  }
}
