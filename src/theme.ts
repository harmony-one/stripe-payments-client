export const theme = {
    global: {
        font: {
            family: "Roboto",
            size: "18px",
            height: "20px",
        },
    },
    button: {
        primary: {
            extend: () => `
            padding: 10px 24px;
            border-radius: 8px;
            background-color: black;
            text-align: center;
            background-color: #46a1ff;
            color: white;
          `
        }
    }
};
