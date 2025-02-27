import { Avatar, Box, Card, CardHeader, Flex, Heading, IconButton, Text } from "@chakra-ui/react";
import { LuTrash2 } from "react-icons/lu";
import EditDialog from "./EditDialog";
import { toaster } from "./toaster";


const UserCard = ({ user, setUsers }) => {

const handleDeleteUser = async () => {
    console.log("handling delete user");
    toaster.create({
        title: "User deleted Succesfully",
        type: "Success",
        duration: 2000,
    })
    try {
        const res = await fetch("http://127.0.0.1:5000/api/friends/" + user.id, {
            method: "DELETE",
        })

        const data = await res.json();
        if(!res.ok) {
            throw new Error(data.error)
        }
        setUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id))

        toaster.create({
            title: "User deleted Succesfully",
            type: "Success",
            duration: 2000,
        })
    } catch (error) {
        console.log("Error encountered");
        toaster.create({
            title: "An error occurred.",
            type: "Error",
            description: error.message,
            duration: 4000,
        })
    }
}

  return (
    <Card.Root>
        <Card.Header>
        <Flex gap={4}>
            <Flex flex={1} gap={4} alignItems="center">
                <Avatar.Root shape="full" size="lg">
                    <Avatar.Fallback name={user.name} />
                    <Avatar.Image src={user.imgUrl} />
                </Avatar.Root>
                <Box>
                    <Heading size="sm">{user.name}</Heading>
                    <Text>{user.role}</Text>
                </Box>
                </Flex>
                <Flex>
                <EditDialog  user={user} setUsers={setUsers}/>
                <IconButton variant="ghost" aria-label="See Menu" colorPalette='red'
                onClick={handleDeleteUser}
                >
                    <LuTrash2 />
                </IconButton>
                </Flex>
                </Flex>
        </Card.Header>  
        <Card.Body>
            <Text>
                {user.description}
            </Text>
        </Card.Body>
        <Card.Footer />
</Card.Root>
  );
};

export default UserCard;
