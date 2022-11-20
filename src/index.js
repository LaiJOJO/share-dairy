import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthContextProvider } from './context/authContext.js'
import Loading from './components/Loading';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        {/* 懒加载 */}
        <Suspense fallback={<Loading />}>
            <AuthContextProvider>
                <App />
            </AuthContextProvider>
        </Suspense>
    </BrowserRouter>
);