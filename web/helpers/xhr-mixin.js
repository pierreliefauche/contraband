export default {
  ajaxConfig: function() {
    return {
      // headers: {},
      xhrFields: {
        withCredentials: true,
      },
      // beforeSend: function(xhr) {
      //   app.state.loading++;

      //   let didDecrement = false;
      //   const decrement = () => {
      //     if (!didDecrement) {
      //       didDecrement = true;
      //       app.state.loading--;
      //     }
      //   };

      //   ['load', 'error', 'abort'].forEach(e => {
      //     xhr.addEventListener(e, decrement);
      //   });
      // },
    };
  },
};
