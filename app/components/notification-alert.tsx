"use client"

import { Alert, Button } from "@heroui/react";
import toast, { Toaster, resolveValue, ToastBar } from "react-hot-toast";
import { XCircleIcon } from "@heroicons/react/24/outline"; 

const NotificationAlert = () => {
  return (
    <Toaster
      position="top-right"
      gutter={8}
    >
      {(t) => (
        <ToastBar 
          style={{
            padding: 0,
            borderRadius: '20px'
          }}
          toast={t}
        >
          {() => (
            t.type !== 'loading' && (  
              <div className="flex gap-2">
                <Alert className="max-w-md" color={t.type === 'success' ? 'success' : 'danger'} title={resolveValue(t.message, t)} endContent={<Button variant="light" isIconOnly startContent={<XCircleIcon className="size-8 text-gray-500"/>} onPress={() => toast.dismiss(t.id)}></Button>} />
              </div>
            )
          )}
        </ToastBar>
      )}
    </Toaster>
  )
}

export default NotificationAlert