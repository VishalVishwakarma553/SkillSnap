import { ReactNode } from "react"

const AuthLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="relative flex justify-center items-center min-h-svh">
            <div className="flex w-full max-w-sm flex-col gap-6">{children}</div>
        </div>
    )
}

export default AuthLayout