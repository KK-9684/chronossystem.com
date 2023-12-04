const accessLocal = {
    loadData: (key) =>{
        try {
            let temp =JSON.parse(localStorage.getItem(key));
            return temp;  
        } catch (error) {
            return undefined
        }
    },
    saveData: (key,data) => {
        localStorage.setItem(key, JSON.stringify(data));
    },
    removeItemFromLocal: (key) => {
        return localStorage.removeItem(key);
    }
}

export default accessLocal;