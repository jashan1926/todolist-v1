/* eslint-disable no-unused-vars */

function getDate() {
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }
    const today = new Date();
    const day = today.toLocaleString('en-GB', options);
    return day;
}

function getDay() {
    const today = new Date();

    const options = {
        weekday: 'long'
    };

    const day = today.toLocaleDateString("en-US", options);

    return day;
}

// export default getDate;
export default { getDay ,getDate };
