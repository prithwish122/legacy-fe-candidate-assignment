import '@testing-library/jest-dom'

// Polyfill TextEncoder for environments that need it
import { TextEncoder, TextDecoder } from 'util'
// @ts-ignore
if (!global.TextEncoder) global.TextEncoder = TextEncoder as any
// @ts-ignore
if (!global.TextDecoder) global.TextDecoder = TextDecoder as any


