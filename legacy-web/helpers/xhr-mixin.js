export default {
  ajaxConfig() {
    return {
      // headers: {},
      xhrFields: {
        withCredentials: true,
      },
      beforeSend: function(xhr) {
        // app.state.loading++;
        this.xhrFetching = true;

        let alreadyEnded = false;
        const didEnd = () => {
          if (!alreadyEnded) {
            alreadyEnded = true;
            this.xhrFetching = false;
          }
        };

        ['load', 'error', 'abort'].forEach(e => {
          xhr.addEventListener(e, didEnd);
        });
      },
    };
  },
};
