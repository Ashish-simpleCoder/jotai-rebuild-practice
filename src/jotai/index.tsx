import { useSyncExternalStore } from 'react'

interface Atom<AtomType> {
   get: () => AtomType
   set: (newValue: AtomType) => void
   subscribe: (callback: (newValue: AtomType) => void) => () => void
}

export function atom<AtomType>(initialValue: AtomType): Atom<AtomType> {
   let value = initialValue
   const subscribers = new Set<(newValue: AtomType) => void>()

   return {
      get: () => value,
      set: (newValue) => {
         value = newValue
         subscribers.forEach((callback) => callback(value))
      },
      subscribe: (callback) => {
         subscribers.add(callback)
         return () => subscribers.delete(callback)
      },
   }
}

export function useAtom<AtomType>(atom: Atom<AtomType>): [AtomType, (newValue: AtomType) => void] {
   return [useSyncExternalStore(atom.subscribe, atom.get), atom.set]
}
export function useAtomValue<AtomType>(atom: Atom<AtomType>): AtomType {
   return useSyncExternalStore(atom.subscribe, atom.get)
}
