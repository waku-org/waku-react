import { useEffect } from "react";

const useMain = () => {
    useEffect(() => {
        console.log(1);
    }, []);
};

export default useMain;
