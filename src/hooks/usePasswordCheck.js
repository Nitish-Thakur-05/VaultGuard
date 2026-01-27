function usePaswordCheck(password) {
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
  return passwordRegex.test(password);
}

export default usePaswordCheck;
