// import { Head, useForm } from '@inertiajs/react';
// import { useEffect } from 'react';
// import toast from 'react-hot-toast';
// import AppLogo from '@/Components/AppLogo';
// import PasswordInput from '@/Components/PasswordInput';

// export default function Login({ status }: { status?: string }) {
//     const { data, setData, post, processing, errors, reset } = useForm({
//         email: '',
//         password: '',
//         remember: false,
//     });

//     useEffect(() => {
//         return () => {
//             reset('password');
//         };
//     }, []);

//     const submit = (e: React.FormEvent) => {
//         e.preventDefault();
//         post('/login', {
//             onError: () => toast.error('Login failed. Check your credentials.'),
//         });
//     };

//     return (
//         <>
//             <Head title="Login" />
//             <div
//                 className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 bg-cover bg-center p-4"
//                 style={{ backgroundImage: "url('/images/login-campus-bg.png')" }}
//             >
//                 <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-darkred/55 to-slate-950/75" />
//                 <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950/80 to-transparent" />

//                 <div className="relative grid w-full max-w-5xl items-center gap-8 lg:grid-cols-[1fr_28rem]">
//                     <div className="hidden max-w-xl text-white lg:block">
//                         <AppLogo textClassName="text-white" />
//                         <h1 className="mt-8 text-4xl font-bold leading-tight">
//                             Teacher Management System
//                         </h1>
//                         <p className="mt-4 text-base leading-7 text-white/75">
//                             A focused workspace for Karandeniya Central College staff, students,
//                             sections, and academic operations.
//                         </p>
//                     </div>

//                     <div className="panel-soft w-full p-6 sm:p-8">
//                         <div className="mb-8">
//                             <AppLogo className="justify-center lg:hidden" />
//                             <div className="mt-6 text-center lg:mt-0 lg:text-left">
//                                 <p className="text-sm font-semibold uppercase tracking-wide text-darkred">
//                                     Welcome back
//                                 </p>
//                                 <h2 className="mt-2 text-3xl font-bold text-slate-950">
//                                     Sign in to KCC TMS
//                                 </h2>
//                                 <p className="mt-2 text-sm leading-6 text-slate-500">
//                                     Use your school account to continue.
//                                 </p>
//                             </div>
//                         </div>

//                         {status && (
//                             <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm font-medium text-green-700">
//                                 {status}
//                             </div>
//                         )}

//                         <form onSubmit={submit} className="space-y-5">
//                             <div>
//                                 <label htmlFor="email" className="field-label">
//                                     Email
//                                 </label>
//                                 <input
//                                     id="email"
//                                     type="email"
//                                     value={data.email}
//                                     onChange={e => setData('email', e.target.value)}
//                                     className="field-input"
//                                     required
//                                     autoComplete="username"
//                                 />
//                                 {errors.email && (
//                                     <p className="field-error">{errors.email}</p>
//                                 )}
//                             </div>

//                             <PasswordInput
//                                 id="password"
//                                 label="Password"
//                                 value={data.password}
//                                 onChange={(value) => setData('password', value)}
//                                 error={errors.password}
//                                 required
//                                 autoComplete="current-password"
//                             />

//                             <div className="flex items-center">
//                                 <input
//                                     id="remember"
//                                     type="checkbox"
//                                     checked={data.remember}
//                                     onChange={e => setData('remember', e.target.checked)}
//                                     className="h-4 w-4 rounded border-slate-300 text-darkred focus:ring-darkred"
//                                 />
//                                 <label htmlFor="remember" className="ml-2 text-sm font-medium text-slate-600">
//                                     Remember me
//                                 </label>
//                             </div>

//                             <button
//                                 type="submit"
//                                 disabled={processing}
//                                 className="primary-button w-full py-3"
//                             >
//                                 Sign In
//                             </button>
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }



import { Head, useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import PasswordInput from '@/Components/PasswordInput';

export default function Login({ status }: { status?: string }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login', {
            onError: () => toast.error('Login failed. Check your credentials.'),
        });
    };

    return (
        <>
            <Head title="Login" />
            <div
                className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 bg-cover bg-center p-4"
                style={{ backgroundImage: "url('/images/login-campus-bg.png')" }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-darkred/55 to-slate-950/75" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950/80 to-transparent" />

                <div className="relative grid w-full max-w-5xl items-center gap-8 lg:grid-cols-[1fr_28rem]">
                    {/* Left panel */}
                    <div className="hidden max-w-xl text-white lg:block">
                        <div className="flex items-center gap-4">
                            <img
                                src="/images/school-logo.png"
                                alt="Karandeniya Central College Logo"
                                className="h-24 w-auto object-contain"
                            />
                            <div>
                                <p className="text-xl font-bold leading-tight">KCC TMS</p>
                                <p className="mt-1 text-sm font-medium text-white/80">
                                    G/Karandeniya Central College
                                </p>
                            </div>
                        </div>
                        <h1 className="mt-8 text-4xl font-bold leading-tight">
                            Teacher Management System
                        </h1>
                        <p className="mt-4 text-base leading-7 text-white/75">
                            A focused workspace for Karandeniya Central College staff, students,
                            sections, and academic operations.
                        </p>
                    </div>

                    {/* Login card */}
                    <div className="panel-soft w-full p-6 sm:p-8">
                        <div className="mb-8">
                            {/* Mobile logo and text */}
                            <div className="flex flex-col items-center gap-3 lg:hidden">
                                <img
                                    src="/images/school-logo.png"
                                    alt="Karandeniya Central College Logo"
                                    className="h-20 w-auto object-contain"
                                />
                                <div className="text-center">
                                    <p className="text-lg font-bold text-slate-950">KCC TMS</p>
                                    <p className="text-sm font-medium text-slate-500">
                                        G/Karandeniya Central College
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 text-center lg:mt-0 lg:text-left">
                                <p className="text-sm font-semibold uppercase tracking-wide text-darkred">
                                    Welcome back
                                </p>
                                <h2 className="mt-2 text-3xl font-bold text-slate-950">
                                    Sign in to KCC TMS
                                </h2>
                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    Use your school account to continue.
                                </p>
                            </div>
                        </div>

                        {status && (
                            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm font-medium text-green-700">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <label htmlFor="email" className="field-label">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    className="field-input"
                                    required
                                    autoComplete="username"
                                />
                                {errors.email && (
                                    <p className="field-error">{errors.email}</p>
                                )}
                            </div>

                            <PasswordInput
                                id="password"
                                label="Password"
                                value={data.password}
                                onChange={(value) => setData('password', value)}
                                error={errors.password}
                                required
                                autoComplete="current-password"
                            />

                            <div className="flex items-center">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={e => setData('remember', e.target.checked)}
                                    className="h-4 w-4 rounded border-slate-300 text-darkred focus:ring-darkred"
                                />
                                <label htmlFor="remember" className="ml-2 text-sm font-medium text-slate-600">
                                    Remember me
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="primary-button w-full py-3"
                            >
                                Sign In
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}