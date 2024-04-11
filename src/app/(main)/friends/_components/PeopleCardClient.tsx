"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { socket } from "~/socket";
import { api } from "~/trpc/react";
import { Oval } from "react-loader-spinner";

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
  const router = useRouter();
  const sendRequest = api.friend.request.useMutation({
    onSuccess: () => {
      router.refresh();
      toast.success("Request Send");
      socket.emit("friendChanged", userId);
    },
    onError: () => {
      toast.error("Error Sending Request");
    },
  });
  const deleteRequest = api.friend.rejectRequest.useMutation({
    onSuccess: () => {
      router.refresh();
      toast.success("Request Deleted");
      socket.emit("friendChanged", userId);
    },
    onError: () => {
      toast.error("Error Cancelling Request");
    },
  });

  return (
    <div className=" flex h-[90px] w-[90%] overflow-hidden rounded-xl bg-[#ffffff] dark:bg-[#202022]">
      <div className=" h-full w-[30%] p-2 ">
        <div className="relative h-full w-full overflow-hidden rounded-xl ">
          <Image src={img} alt="" fill />
        </div>
      </div>
      <div className="flex h-full w-[70%] flex-col items-center justify-between">
        <div className="flex w-full flex-wrap pl-2 pt-3 font-urbanist text-xl font-bold">
          {name}
        </div>
        <div className="flex  w-full items-center justify-end p-2">
          {present ? (
            <div>
              {deleteRequest.isPending ? (
                <div className="h-8 w-8 ">
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
                </div>
              ) : (
                <div
                  className="cursor-pointer rounded-[5px] bg-red-500 px-1 py-0.5 font-bold text-black"
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
                  className="cursor-pointer rounded-[5px] bg-[#E6CA62] px-2 py-0.5 font-urbanist font-bold text-black"
                  onClick={() => {
                    sendRequest.mutate({
                      senderId: userId,
                      receiverId: peopleId,
                    });
                  }}
                >
                  send request
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
