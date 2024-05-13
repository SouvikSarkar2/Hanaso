"use client";

import { Plus, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { socket } from "~/socket";
import { api } from "~/trpc/react";
import { Oval } from "react-loader-spinner";
import { useEffect, useState } from "react";

const PeopleCardClient = ({
  peopleId,
  name,
  img,
  present,
  userId,
}: {
  peopleId: string;
  name: string;
  img: string;
  present: boolean;
  userId: string;
}) => {
  const Router = useRouter();
  useEffect(() => {
    socket.on("friendChanged", () => {
      Router.refresh();
    });
  }, [Router]);
  const [isPresent, SetIsPresent] = useState(present);
  const sendRequest = api.friend.request.useMutation({
    onSuccess: () => {
      toast.success("Request Send");
      socket.emit("friendChanged", userId);
      SetIsPresent(true);
    },
    onError: () => {
      toast.error("Error Sending Request");
    },
  });
  const deleteRequest = api.friend.rejectRequest.useMutation({
    onSuccess: () => {
      SetIsPresent(false);
      toast.success("Request Deleted");
      socket.emit("friendChanged", userId);
    },
    onError: () => {
      toast.error("Error Cancelling Request");
    },
  });

  return (
    <div className=" flex h-[155px] w-[148px] flex-col overflow-hidden rounded-xl bg-[#ffffff] dark:bg-[#202022]">
      <div className=" h-[80%] w-full p-1 ">
        <div className="relative h-[110px] w-[110px] overflow-hidden rounded-xl ">
          <Image src={img} alt="" fill />
        </div>
      </div>
      <div className="flex h-[20%] w-full  items-center justify-between">
        <div className="text-md flex w-[70%] flex-wrap pl-2 font-urbanist font-bold">
          {name}
        </div>
        <div className="flex  w-[30%] items-center justify-end pb-1 pr-1">
          {isPresent ? (
            <div>
              {deleteRequest.isPending ? (
                <Oval
                  visible={true}
                  height="20"
                  width="20"
                  color="#000000"
                  secondaryColor="#ffffff"
                  ariaLabel="oval-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                />
              ) : (
                <div
                  className="cursor-pointer rounded-[10px] bg-red-500 p-0.5 font-bold text-black"
                  onClick={() => {
                    deleteRequest.mutate({
                      senderId: userId,
                      receiverId: peopleId,
                    });
                  }}
                >
                  <X size={20} />
                </div>
              )}
            </div>
          ) : (
            <div>
              {sendRequest.isPending ? (
                <Oval
                  visible={true}
                  height="20"
                  width="20"
                  color="#000000"
                  secondaryColor="#ffffff"
                  ariaLabel="oval-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                />
              ) : (
                <div
                  className="cursor-pointer rounded-[10px] bg-[#E6CA62] p-0.5 font-urbanist font-bold text-black"
                  onClick={() => {
                    sendRequest.mutate({
                      senderId: userId,
                      receiverId: peopleId,
                    });
                  }}
                >
                  <Plus />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PeopleCardClient;
