"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";

import { MessageSquareText, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { socket } from "~/socket";

import { api } from "~/trpc/react";

const FriendCard = ({
  name,
  img,
  id,
  currUserId,
}: {
  name: string;
  img: string;
  id: string;
  currUserId: string;
}) => {
  const Router = useRouter();
  const deleteFriend = api.friend.deleteFriend.useMutation({
    onSuccess: () => {
      Router.refresh();
      toast.success("Friend Removed");
      socket.emit("friendChanged", currUserId);
    },
  });

  if (deleteFriend.isPending) {
    return <div>Removing Friend...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="  flex h-[120px] w-[160px] items-start  justify-end gap-1  rounded-xl">
        <div className=" relative left-0 top-0 h-[120px] w-[120px] overflow-hidden  rounded-l-xl rounded-br-xl duration-500">
          <Image src={img} alt="" fill />
        </div>
        <div>
          <div className="flex  flex-col items-center justify-center gap-1">
            <div
              onClick={() => Router.push(`/chats?q=${id}`)}
              className=" cursor-pointer rounded-r-[5px] rounded-tr-xl  bg-[#E6CA62] px-2 py-1 font-urbanist font-bold text-black duration-300 hover:scale-110"
            >
              <MessageSquareText size={20} />
            </div>
            <div className=" cursor-pointer rounded-r-[5px] rounded-br-xl bg-red-500 px-2 py-1 font-urbanist font-bold text-black duration-300 hover:scale-110">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Trash2 size={20} />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Your Friend will get deleted along with all the messages
                      calls you have with them
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="rounded-xl"
                      onClick={() =>
                        deleteFriend.mutate({ Id1: id, Id2: currUserId })
                      }
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>
      <div className="text-md flex h-[70px] w-[160px] cursor-default flex-col items-end justify-between rounded-[10px] bg-inherit p-1 px-1 text-[16px]   blur-0 ">
        <div className="flex w-full items-start justify-start font-urbanist font-semibold ">
          {name}
        </div>
      </div>
    </div>
  );
};

export default FriendCard;
