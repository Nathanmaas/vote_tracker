$(document).ready(function(){

  var cats = []
  var barChart;
  var tracker = {
    selected: []
    ,checkSelected: function(checkIdx){
      var c = 0
      var len = this.selected.length;
      for(c; c < len; c++){
        if(this.selected[c] === checkIdx) return true;
      }
      return false;
    },
    addImageIdx: function(idx){
      if(!(this.checkSelected(idx))){
        this.selected.push(idx);
        return idx;
      }else{
        return -1;
      }
    },
    resetSelected: function(){
      this.selected.length = 0;
    }
  };
  var Cat = function(url,id) {
        this.url = url;
        this.votes = 0;
        this.id = id;
  };

    $.ajax({
    url:('https://api.imgur.com/3/album/DDoWy'),
    method: 'GET',
    headers: {'Authorization': 'Client-ID f5b73f08e320402'
      }
      }).done(function(res){
        start(res.data.images);
      }).fail(function(err){
        console.dir(err);
      });

  function start(srcArray){
    var c = 0, len =srcArray.length;
    var picOne = document.getElementById('cat1')
    var picTwo = document.getElementById('cat2')
      for (c; c<len;c++) {
      cats.push(new Cat(srcArray[c].link, srcArray[c].id));
      }
      renderCats(picOne);
      renderCats(picTwo);
      addEvents(picOne, picTwo);
      buildChart();
    };

  function randomInt(max){
    return Math.floor(Math.random()* max);
  };

  function renderCats(pic, otherPic) {
    var picNew, otherIdx;
    if(otherPic) otherIdx = otherPic.dataset.idx;
      else otherIdx = -1;
      do {
        picNew = getNewImage();
      }
        while (picNew.idx==otherIdx);
        pic.setAttribute('src', picNew.img);
        pic.setAttribute('data-idx', picNew.idx);

  }

  function addEvents(pic1, pic2){
    document.getElementById('btn').addEventListener('click', function(e){

    });

    pic1.addEventListener('click', function(e){
      var idx = e.target.dataset.idx;
      cats[idx].votes +=1;
      console.log(cats[idx].votes);
      barChart.datasets[0].bars[idx].value = cats[idx].votes
      barChart.update();
      renderCats(pic2,pic1)
    });
    pic2.addEventListener('click', function(e){
      var idx = e.target.dataset.idx;
      cats[idx].votes +=1;
      barChart.datasets[0].bars[idx].value = cats[idx].votes;
      barChart.update();
      renderCats(pic1, pic2);
    });
  }

  function zeroOutVotes() {
    var c = 0;
    var len = cats.length;
    for (c; c < len; c++) {
      cats[c].votes = 0;
    }
  resetChart();
  }

  function resetChart() {
    var c = 0;
    var len = barChart.datasets[0].bars.length;
    for (c; c < len; c++) {
      barChart.datasets[0].bars[c].value = 0;
    }
    barChart.update();
  }
  function getNewImage() {
    var sLen = tracker.selected.length;
    var iLen = cats.length;
    var idx;
    if (sLen < iLen -1){
      idx = randomInt(iLen);
      while (!(tracker.addImageIdx(idx) === idx)) {
        idx = randomInt(iLen);
      }
    }
    else {
      tracker.resetSelected();
      idx = randomInt(iLen);
    }

    return {
      idx: idx, img: cats[idx].url
    };
  }
  function buildChart() {
    var ctx = document.getElementById('myChart').getContext('2d');
    var c = 0
    var len = cats.length;
    var data = {labels:[], datasets: [{data: [], fillColor: '#3f2933'}]};
    for (c; c < len; c++) {
        data.labels.push(cats[c].id);
        data.datasets[0].data.push(cats[c].votes);
      }
      barChart = new Chart(ctx).Bar(data);

    }
});

//get something to store here - window.







