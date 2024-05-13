import { Avatar, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image, Link, Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle, User } from "@nextui-org/react";
import { signIn, signOut, useSession } from "next-auth/react";
import { FC, ReactNode, useState } from "react";
import { FaGuilded, FaRobot, FaUser } from "react-icons/fa6";
import { BarLoader } from "react-spinners";

export const Spinner: FC<{ includeText?: boolean }> = ({ includeText }) => {
    return (
        <div className="h-full w-full flex justify-center items-center fixed top-0 left-0">
            <div className="flex flex-col items-center">
                <BarLoader color="white" loading={true} />
                {includeText && <p className="mt-2">Loading...</p>}
            </div>
        </div>
    );
};

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { data: session, status } = useSession();
    const profile = session?.profile;

    const items = [
        {
            name: "Home",
            href: "/",
        },
    ];

    if (status === "loading") return (<Spinner includeText />);
    return (
        <>
            <Navbar isBordered maxWidth={"full"} isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
                <NavbarContent>
                    <NavbarMenuToggle
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                        className="sm:hidden"
                    />
                    <NavbarBrand as={Link} href={"/"} className="gap-1 text-foreground">
                        <Image
                            src={`/images/logo.png`}
                            alt={"Nest"}
                            height={36}
                            width={36}
                        />
                        <p className="font-bold text-inherit">NEST</p>
                    </NavbarBrand>
                </NavbarContent>
                <NavbarContent className="hidden sm:flex gap-4" justify="center">
                    {items.map((item) => (
                        <NavbarItem key={item.href}>
                            <Link color="foreground" href={item.href}>{item.name}</Link>
                        </NavbarItem>
                    ))}
                </NavbarContent>
                <NavbarContent as="div" justify="end">
                    {status === "authenticated" ? (
                        <Dropdown 
                            showArrow 
                            placement="bottom-end" 
                            classNames={{
                                base: "before:bg-default-200",
                                content: "py-1 px-1 border border-default-200 bg-gradient-to-br from-white to-default-200 dark:from-default-50 dark:to-black",
                            }} 
                        >
                            <DropdownTrigger>
                                <Avatar
                                    isBordered
                                    as="button"
                                    className="transition-transform"
                                    color="secondary"
                                    name={profile?.name}
                                    size="sm"
                                    src={profile?.avatar}
                                />
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Profile Actions" variant="flat">
                                <DropdownItem 
                                    key="profile" 
                                    href={`/users/${profile?.id}`} 
                                    description={`View my profile.`}
                                    startContent={<FaUser />}
                                >
                                    Profile
                                </DropdownItem>
                                <DropdownItem 
                                    key="add-bot" 
                                    href={`/bots/add`} 
                                    description={`Add a bot.`}
                                    startContent={<FaRobot />}
                                >
                                    Add Bot
                                </DropdownItem>
                                <DropdownItem 
                                    key="logout" 
                                    className="text-danger" 
                                    color="danger"
                                    description={`Logout of this account.`} 
                                    startContent={<FaUser />} 
                                    onPress={() => signOut()}
                                >
                                    Logout
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    ) : (
                        <NavbarItem>
                            <Button 
                                variant="bordered"
                                startContent={<FaGuilded color="#F5C400" size={18} />}
                                onPress={() => signIn("cardboard")}
                            >
                                Login
                            </Button>
                        </NavbarItem>
                    )}
                </NavbarContent>
                <NavbarMenu>
                    {items.map((item) => (
                        <NavbarMenuItem key={item.href}>
                            <Link 
                                className="w-full" 
                                size="lg" 
                                color="foreground" 
                                href={item.href}
                            >{item.name}</Link>
                        </NavbarMenuItem>
                    ))}
                </NavbarMenu>
            </Navbar>
            {children}
        </>
    );
};

export default Layout;