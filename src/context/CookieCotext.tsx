import Cookies from 'js-cookie';
import { useState, useEffect, createContext, useContext } from 'react';

const acceptCookie = () => Cookies.set('cookieAccepted', 'true', { expires: 30, sameSite: 'Lax' });
const checkCookie = () => Cookies.get('cookieAccepted') === 'true';
//const removeCookie = () => Cookies.remove('cookieAccepted');

const CookieContext = createContext({
    accepted: false,
    acceptCookies: () => { }
});

export const CookieProvider = ({ children }: { children: React.ReactNode }) => {
    const [accepted, setAccepted] = useState(false);

    useEffect(() => {
        setAccepted(checkCookie());
    }, []);

    const acceptCookiesHandler = () => {
        acceptCookie();
        setAccepted(true);
    };

    return (
        <CookieContext.Provider value={{ accepted, acceptCookies: acceptCookiesHandler }}>
            {children}
        </CookieContext.Provider>
    );
}

export const useCookie = () => {
  const ctx = useContext(CookieContext);
  if (!ctx) throw new Error('useCookie 必須放在 CookieProvider 內使用');
  return ctx;
};