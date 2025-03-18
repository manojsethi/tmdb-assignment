export default function isLocalEnv() {
  return process.env.NODE_ENV === 'local';
}
