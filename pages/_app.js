import '../styles/globals.css';
// Toast
import { ToastProvider } from 'react-toast-notifications';

function MyApp({ Component, pageProps }) {
  return (
    <ToastProvider
    autoDismiss
    autoDismissTimeout={6000}
    >
      <Component {...pageProps} />
    </ToastProvider>
  )
}

export default MyApp
