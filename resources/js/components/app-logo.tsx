import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-15 items-center justify-center rounded-md">
               <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQU6xZ8dQBY1PY0OBsAMf9TiV7ddUW2TZejfg&s'/>
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-semibold">CLC</span>
            </div>
        </>
    );
}
