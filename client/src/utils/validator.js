export const checkInputField = (inputs) => {
    if (Object.keys(inputs).includes('vimeoID')) {
        const filteredInputs = Object.fromEntries(
            Object.entries(inputs).filter(([key]) => key !== 'vimeoID')
        );
        return Object.values(filteredInputs).some(value => value === '');
    } else {
        return Object.values(inputs).some(value => value === '');
    }
};

export const checkUserInputField = (inputs) => {
    if (inputs.level === "user") {
        return Object.values(inputs).some(value => value === '');
    } else {
        const filteredInputs = Object.fromEntries(
            Object.entries(inputs).filter(([key]) => key !== 'school' && key !== 'grade')
        );
        return Object.values(filteredInputs).some(value => value === '');
    }
};