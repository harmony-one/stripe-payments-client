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
            padding: 8px 24px;
            border-radius: 6px;
            background-color: black;
            text-align: center;
          `
        }
    }
};
