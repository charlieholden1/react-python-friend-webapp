"use client"

import { Button, Input, Stack, Textarea, IconButton} from "@chakra-ui/react";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { useRef } from "react";
import { BiEditAlt } from "react-icons/bi";
import { useState } from "react";
import { toaster } from "./toaster";

const EditDialog = ({ setUsers, user}) => {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
	const [inputs, setInputs] = useState({
		name: user.name,
		role: user.role,
		description: user.description,
	});
  
  const handleEditUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
        const res = await fetch("http://127.0.0.1:5000/api/friends/" + user.id, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(inputs),
        })

        const data = await res.json();
        if(!res.ok){
            throw new Error(data.error)
        }

        setUsers((prevUsers) => prevUsers.map((u) => (u.id === user.id ? data : u)));
        setOpen(false);

        toaster.create({
            title: "Success",
            type: "Success",
            description: "Friend Updated",
            duration: 2000,
        })
    } catch (error) {
        toaster.create({
            title: "An error occurred.",
            type: "error",
            description: error.message,
            duration: 4000,
        })
    } finally {
        setIsLoading(false);
    }
  }
    const ref = useRef<HTMLInputElement>(null);

    return (
      <DialogRoot placement="center" motionPreset="slide-in-bottom" initialFocusEl={() => ref.current}
      open={open} onOpenChange={setOpen}
      >
        <DialogTrigger asChild>
        <IconButton variant="ghost" aria-label="Edit Friend" colorPalette='white'>
            <BiEditAlt />
        </IconButton>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Friend 😍</DialogTitle>
          </DialogHeader>
          <DialogBody pb="4">
            <Stack gap="4">
              <Field label="Full Name">
                <Input placeholder="John Doe"
                  value={inputs.name}
                  onChange={(e) => setInputs((prev) => ({ ...prev, name: e.target.value }))}/>
              </Field>
              <Field label="Role">
                <Input placeholder="Software Engineer" 
                  value={inputs.role}
                  onChange={(e) => setInputs((prev) => ({ ...prev, role: e.target.value }))}/>
              </Field>
              <Field label="Description">
                  <Textarea placeholder="He's a software engineer who loves to code and build things."
                  value={inputs.description}
                  onChange={(e) => setInputs((prev) => ({ ...prev, description: e.target.value }))}/>
              </Field>
            </Stack>
          </DialogBody>
          <DialogFooter>
              <Button variant="outline"
              onClick={() => setOpen(false)}
              >Cancel</Button>
            <Button
            isLoading={isLoading}
            onClick={handleEditUser}
            >Add</Button>
          </DialogFooter>
          <DialogCloseTrigger />
        </DialogContent>
      </DialogRoot>
    );
}

export default EditDialog