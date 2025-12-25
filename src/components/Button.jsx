export function Button({name,onClick}){
    return <div>
        <button onClick={onClick} type="submit" className="text-white focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800">{name}</button>
    </div>
}