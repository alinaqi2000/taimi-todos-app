import Logo from "../brand/Logo";
import AuthResolver from "../hoc/AuthResolver";

export default function AuthLayout(props: { title: string, children: JSX.Element | JSX.Element[] }) {
    return (
        <AuthResolver>
            <div className="pt-6 w-full flex justify-center">
                <div className="w-full md:w-1/2 mx-10 px-4 py-6 shadow-xl">
                    <Logo />
                    <div className="mt-8 mb-5">
                        <h3 className="text-center font-semibold">{props.title}</h3>
                    </div>
                    {props.children}
                </div>

            </div>
        </AuthResolver >
    )
}
