import Component from '@ember/component';

export default Component.extend({
  actions: {
    handleFileUpload(evt) {
      let file = evt.target.files[0];
      let reader = new FileReader();

      reader.onloadend = (endEvt => {
        if (endEvt.target.readyState == FileReader.DONE) {
          console.log(endEvt.target.result);
        }
      });

      let blob = file.slice(0, file.size);
      reader.readAsText(blob);
    }
  }
});
