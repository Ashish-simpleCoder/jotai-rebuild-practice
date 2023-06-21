import { atom, useAtom, useAtomValue } from './jotai'

const salaryAtom = atom(100_000)

export default function App() {
   const [salary, setSalary] = useAtom(salaryAtom)

   return (
      <>
         <div>
            <div>
               <input value={salary} onChange={(e) => setSalary(+e.target.value)} />
            </div>
            <div>
               <p>Salary : {salary}</p>
            </div>
            <DisplaySalary />
         </div>
      </>
   )
}

function DisplaySalary() {
   const salary = useAtomValue(salaryAtom)
   return <div>Salary: {salary}</div>
}
