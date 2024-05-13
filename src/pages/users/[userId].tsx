import Bots from "@/components/bots";
import { Spinner } from "@/components/layout";
import useExternalUser from "@/hooks/useExternalUser";
import useUser from "@/hooks/useUser";
import { Avatar, Button, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { FaPencil, FaUserPen } from "react-icons/fa6";
import { toast } from "sonner";

const UserPage = () => {
    const [bio, setBio] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const { userId } = router.query;

    const { data: session } = useSession();
    const profile = session?.profile;

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const { data: externalUser, isLoading } = useExternalUser(userId as string);
    const { data: user, isLoading: userLoading } = useUser(userId as string);

    useEffect(() => {
        setBio(user?.bio);
    }, [
        user?.bio
    ]);

    const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
        try {
            setLoading(true);
            e.stopPropagation();
            e.preventDefault();

            await axios.post(`/api/users/edit`, {
                bio,
            });

            toast.success(`Saved!`);
        } catch (error) {
            toast.error(`Something went wrong.`);
        } finally {
            setLoading(false);
        };
    }, [
        bio,
    ]);

    if (isLoading || userLoading) return (<Spinner />);
    return (
        <div className="page">
            <div className="flex justify-between">
                <div className="flex items-center gap-2">
                    <Avatar
                        isBordered
                        color="success"
                        className="transition-transform"
                        name={externalUser?.name}
                        src={externalUser?.profilePicture}
                        size="lg"
                    />
                    <div>
                        <h1>{externalUser?.name}</h1>
                        <span className="text-foreground-500">{bio}</span>
                    </div>
                </div>
                {profile?.id === userId ? (
                    <>
                        <Button
                            variant="bordered"
                            startContent={<FaPencil />}
                            onPress={onOpen}
                        >Edit</Button>
                        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                            <ModalContent>
                                {(onClose) => (
                                    <form onSubmit={handleSubmit}>
                                        <ModalHeader className="flex flex-col gap-1">Edit Profile</ModalHeader>
                                        <ModalBody>
                                            <Input
                                                autoFocus
                                                label="Bio"
                                                placeholder="A mysterious user."
                                                variant="bordered"
                                                value={bio}
                                                onValueChange={setBio}
                                                startContent={<FaUserPen />}
                                            />
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button
                                                color="success"
                                                type="submit"
                                            >Save</Button>
                                        </ModalFooter>
                                    </form>
                                )}
                            </ModalContent>
                        </Modal>
                    </>
                ) : (<></>)}
            </div>
            <Divider className="my-4" />
            <Bots creatorId={userId as string} />
        </div>
    );
};

export default UserPage;