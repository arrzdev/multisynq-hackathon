import useCustomStateTogether from '@/hooks/useCustomStateTogether'
import { useState } from 'react'
import { useIsTogether } from 'react-together'

const CustomHookUsage = () => {
  //this custom hook not only allows persistence of the data of the disconnected user
  //but also allows to set the id for a specific user by passing a custom viewId
  const [userName, setUserName] = useState('')
  const [sessionName, setSessionName] = useState('')
  const [count, setCount, countPerUser] = useCustomStateTogether('super-saa', 0, sessionName, true)

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {
        !sessionName ? (
          <div className="flex flex-col items-center space-y-4">
            <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} className="border-2 border-gray-300 rounded-md p-2 text-lg"/>
            <button onClick={() => setSessionName(userName)} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Set session name</button>
          </div>


        ) : useIsTogether() && (
            <div className="mb-4 space-y-4 w-96">  
              <div className="mb-4">You are connected to the together server as: {sessionName}</div>
              {Object.entries(countPerUser).map(([userId, count]) => (
                <div key={userId} className="bg-gray-100 p-2 rounded-lg shadow-sm text-gray-800 font-medium">{userId}: {count}</div>
              ))}
              <div className="flex flex-col gap-1 w-full">
                <button onClick={() => setCount(count + 1)} className="bg-blue-500 text-white px-4 py-2 rounded-md">Increment</button>
                <button onClick={() => setCount(0)} className="bg-red-500 text-white px-4 py-2 rounded-md">Reset</button>
              </div>
          </div>
        )
      }
    </div>
  )
}

export default CustomHookUsage