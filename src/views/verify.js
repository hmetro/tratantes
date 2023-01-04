const Verify = {
    verifyRegister: (token) => {
        return m.request({
                method: "POST",
                url: "https://api.hospitalmetropolitano.org/v2/medicos/verify",
                body: {
                    token: token,
                }
            })
            .then(function(res) {
                alert(res.message);
                if (res.status) {
                    location.href = "/";
                }
            }).catch(function(error) {
                alert(error);
            });
    },


    oncreate: () => {

    },
    oninit: (data) => {
        Verify.verifyRegister(data.attrs.token);
    },
    view: () => {

    },
};

export default Verify;