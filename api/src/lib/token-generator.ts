const generateToken = (length: number) => {
  let text = '';
  const CHARACTER_LIST = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += CHARACTER_LIST.charAt(
      Math.floor(Math.random() * CHARACTER_LIST.length)
    );
  }

  return text;
};

export const generateUserToken = () => {
  const token = generateToken(20);
  return `U-${token}`;
}
