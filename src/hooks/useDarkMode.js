import useMediaQuery from '@material-ui/core/useMediaQuery';

const useDarkMode = () => useMediaQuery('(prefers-color-scheme: dark)');

export default useDarkMode;
