module.exports = {
  extends: ['@imhoff/eslint-config/recommended'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
}
