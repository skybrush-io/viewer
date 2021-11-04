import useMediaQuery from '@mui/material/useMediaQuery';

const useDarkMode = () => useMediaQuery('(prefers-color-scheme: dark)');

export default useDarkMode;
