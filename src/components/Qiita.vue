<template>
  <div class="qiita">
    <div class="jumbotron jumbotron-fluid bg-success text-white">
      <div class="container">
        <h1 class="display-4">Made in Qiita</h1>
        <p class="lead">This is a modified jumbotron that occupies the entire horizontal space of its parent.</p>
      </div>
    </div>

    <div class="p-3 mb-2 bg-light text-dark">
      <div class="v-margin25"></div>

        <div class="mx-auto max-width-layout1300">
          <div v-show="debug">
            <div class="card shadow text-left">
              <div class="card-header bg-warning">Qiita </div>
              <div class="card-body">
                <h4 class="card-title text-left text-warning">hogeeeeeee</h4>
                <p>aaaa<input v-model="user" placeholder="@jimpei, @yamuscle"></p>
                <p>aaaa<input v-model="user" placeholder="@jimpei, @yamuscle"></p>
                <p>aaaa<input v-model="user" placeholder="@jimpei, @yamuscle"></p>
                <p>aaaa<input v-model="user" placeholder="@jimpei, @yamuscle"></p>
                <p>aaaa<input v-model="user" placeholder="@jimpei, @yamuscle"></p>

                <div class="v-margin25"></div>
                <button @click="dbAdd" class="btn btn-warning">
                  <div v-if="show" class="spinner-border spinner-border-sm text-light" role="status">
                    <span class="sr-only">dbAdd...</span>
                  </div>
                  dbAdd
                </button>

              </div>
            </div>
          </div>
          <div class="v-margin25"></div>

          username filter
          <input v-model="user" placeholder="@jimpei, @yamuscle">
          tag filter
          <input v-model="tag" placeholder="php, vue">
          <button @click="dbRefer" class="btn btn-warning">filter</button>
          <div class="v-margin25"></div>

          <div class="row">
            <div v-for="(qiitaItem, key, index) in qiitaItems" :key="index" class="col-xs-12 col-sm-12 col-md-6 col-lg-4">
              <div class="card shape-radius">
                <img :src="qiitaItem.data().image_url" class="card-img-top shape-radius-top" alt="...">
                <div class="card-body">
                  <div class="text-right">
                    <div v-for="(tag, kkey, iindex) in qiitaItem.data().tags" :key="iindex" class="text-right badge badge-pill badge-success">
                      {{ tag }}
                    </div>
                  </div>
                  <h4 class="card-title"><strong><a :href="qiitaItem.data().service_url">{{ qiitaItem.data().service_title }}</a></strong></h4>
                  <p class="card-text">
                    <a :href="qiitaItem.data().qiita_url">{{ qiitaItem.data().qiita_title }}</a>
                  </p>
                  <!-- <button @click="dbDelete(comment.id)" class="btn btn-danger">delete {{ comment.id }}</button> -->
                </div>
                <div class="card-footer shape-radius-bottom">
                  <small class="text-muted">
                    {{ qiitaItem.data().create_date.seconds | toDate }} {{ qiitaItem.data().qiita_user }} 
                  </small>
                </div>
              </div>
              <div class="v-margin25"></div>
            </div>
          </div>

        </div>

      </div>
      <div class="v-margin25"></div>
    </div>

  </div>
</template>

<script>
// @ is an alias to /src
// import firebase from "firebase";
// import store from "../store";
import {db} from "../firebase";

export default {
  name: "qiita",
  components: {
  },
  data () {
    return {
      debug: true,
      qiitaItems: [],
      user: '',
      tag: '',
      show: false,
    }
  },
  filters: {
    toDate (value) {
      let date = new Date(value * 1000);
      let month = date.getMonth() + 1;
      return date.getFullYear() + '/' + month + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() ;
    }
  },
  mounted() {
    // yamuscle
    db.collection("qiita_items")
    .onSnapshot(res => {
      console.log('mounted start');
      // console.log('cnt = ' + this.cnt);
      let array = [];
      res.docs.forEach(doc => {
        // console.log(doc.id, "=>", doc.data());
        let tmpArray = doc;
        array.push(tmpArray);
      });
      console.dir(array);
      this.qiitaItems = array;
    });
  },
  computed: {
    // user() {
    //   return this.$store.getters.user;
    // }
  },
  methods: {
    dbRefer () {
      // orderBy("create_date", 'desc')
      let dbRef;
      if (this.user) {
        dbRef = db.collection('qiita_items').where("qiita_user", "==", this.user);
      } else {
        dbRef = db.collection('qiita_items');
      }
      if (this.tag) {
        dbRef = db.collection('qiita_items').where("tags", "array-contains", this.tag);
      } else {
        dbRef = db.collection('qiita_items');
      }
      let allData = dbRef.get()
        .then(snapshot => {
          let array = [];
          snapshot.forEach(doc => {
            // console.log(doc.id, "=>", doc.data());
            let tmpArray = doc;
            array.push(tmpArray);
          });
          console.dir(array);
          this.qiitaItems = array;
          // return array;
        })
        .catch(err => {
          console.log("Error getting documents", err);
        });
    },
    dbAdd () {
      this.show = true;
      db.collection('qiita_items').doc('7effbab8fa65f398b731').set({
        qiita_id: '7effbab8fa65f398b731',
        qiita_title: 'JIRA APIを使用してチケットを作成する',
        qiita_url: 'https://qiita.com/jimpei/items/7effbab8fa65f398b731',
        qiita_user: '@jimpei',
        service_title: 'hoge4',
        tags : [
          "jira",
          "javascript"
        ],
        create_date: new Date()
      }).then(result => {
        console.log('db insert success');
        this.show = false;
      }).catch(error => {
        console.log('db insert error')
        this.show = false;
      });
    },
    dbDelete (id) {
      this.show = true;
      db.collection('chat').doc('room1').collection('messages').doc(id).delete()
      .then(result => {
        console.log('db delete success');
        this.show = false;
      }).catch(error => {
        console.log('db delete error')
        this.show = false;
      });
    },
    infiniteHandler($state) {
      // console.log('debug cnt' + this.cnt);

      this.show = true;
      let dbRef = db.collection('chat').doc('room1').collection('messages').orderBy("createdAt", 'desc').limit(this.cnt);
      let allData = dbRef.get()
        .then(snapshot => {
          let array = [];
          snapshot.forEach(doc => {
            // console.log(doc.id, "=>", doc.data());
            // let tmpArray = JSON.parse(JSON.stringify(doc.data()));
            let tmpArray = doc;
            array.push(tmpArray);
          });
          console.dir(array);
          this.comments = array;
          this.show = false;
          // return array;
        })
        .catch(err => {
          console.log("Error getting documents", err);
          this.show = false;
        });

      this.cnt = this.cnt + 3;
      var cntMax = this.cnt;

      setTimeout( () => {
        // console.log(cntMax)
        if (cntMax > 15) {
          console.log('infinite-loading complete')
          $state.complete();
        } else {
          console.log('infinite-loading loaded')
          $state.loaded();
        }
      }, 2000 );

    }
  }
};
</script>

<style scoped>
.shape-radius {
  border-radius: 30px 30px 30px 30px;
}
.shape-radius-top {
  border-radius: 30px 30px 0px 0px;
}
.shape-radius-bottom {
  border-radius: 0px 0px 30px 30px;
}
.card {
  box-shadow: 5px 5px 20px #dadada;
  transition: .2s;
}
.card:hover {
  box-shadow: none;
  transform: translate3d(0, 5px, 0);
}
</style>
