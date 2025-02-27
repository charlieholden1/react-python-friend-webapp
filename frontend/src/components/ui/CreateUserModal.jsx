"use client"

import { Button, Input, Stack, Flex, Textarea } from "@chakra-ui/react";
import { Radio, RadioGroup } from "@/components/ui/radio"
import { Toaster, toaster } from "@/components/ui/toaster"
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
import { useState } from "react";

const CreateUserModal = ({ setUsers }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [inputs, setInputs] = useState({
    name: "",
    role: "",
    description: "",
    gender: "",
  });

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
        const res = await fetch("http://127.0.0.1:5000/api/friends", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(inputs),
        })

        const data = await res.json();
        if(!res.ok){
            throw new Error(data.error)
        }
        toaster.success({
            title: "Success",
            description: "Friend Created",
        })
        setOpen(false);
        setUsers((prevUsers) => [...prevUsers, data]);
        setIsLoading(false);
        setInputs({
            name: "",
            role: "",
            description: "",
            gender: "",
        });
    } catch (error) {
        toaster.create({
            title: "An error occurred.",
            type: "error",
            description: error.message,
        })
    } finally {
    }
  }
  return (
    <DialogRoot open={open} onOpenChange={setOpen}
    placement="center" motionPreset="slide-in-bottom" initialFocusEl={() => ref.current}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Friend</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>My New BFF 😍</DialogTitle>
        </DialogHeader>
        <DialogBody pb="4">
          <Stack gap="4">
            <Field label="Full Name" required>
              <Input placeholder="John Doe"
                value = {inputs.name}
                onChange={(e) => setInputs({...inputs, name: e.target.value})}
              />
            </Field>
            <Field label="Role" required>
              <Input placeholder="Software Engineer" 
                value = {inputs.role}
                onChange={(e) => setInputs({...inputs, role: e.target.value})}
              />
            </Field>
            <Field label="Description">
                <Textarea placeholder="He's a software engineer who loves to code and build things."
                value = {inputs.description}
                onChange={(e) => setInputs({...inputs, description: e.target.value})}
                />
            </Field>
            <RadioGroup mt={4}>
                <Flex gap={5}>
                    <Radio value="male"
                    onChange={(e) => setInputs({...inputs, gender: e.target.value})}
                    >Male</Radio>
                    <Radio value="female"
                    onChange={(e) => setInputs({...inputs, gender: e.target.value})}
                    >Female</Radio>
                </Flex>
            </RadioGroup>
          </Stack>
        </DialogBody>
        <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Toaster />
          <Button 
          isLoading={isLoading}
          colorPalette='green' 
          mr={3}
          onClick={handleCreateUser} >Add</Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default CreateUserModal;
