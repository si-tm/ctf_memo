//  highlight comments with it's id
const templates = {};
for (const [id, template] of new URLSearchParams(location.search)) {
  if (!(id in templates)) {
    templates[id] = {};
  }
  templates[id].template = template;
}

const Home = {
  template: "#home",
  data() {
    return {
      newTitle: "",
      submitting: false,
      message: "",
      threads: [],
    };
  },
  async created() {
    const res = await fetch("/api/threads");
    const data = await res.json();
    this.threads = data.threads;
  },
  methods: {
    async createThread() {
      if (this.submitting) {
        return;
      }
      this.submitting = true;
      const res = await fetch("/api/threads", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({title: this.newTitle})
      });
      const data = await res.json();
      if (data.error) {
        this.message = data.error;
      } else {
        this.$router.push(`/threads/${data.id}`);
      }
      this.submitting = false;
    },
  }
};

const Thread = {
  template: "#thread",
  data() {
    return {
      id: this.$route.params.id,
      found: false,
      title: "",
      newText: "",
      submitting: false,
      message: "",
      comments: [],
    };
  },
  async created() {
    const res = await fetch(`/api/threads/${this.id}`);
    const data = await res.json();
    if (!data.error) {
      this.found = true;
      this.title = data.title;
      this.comments = data.comments;
    }
  },
  methods: {
    async createComment() {
      if (this.submitting) {
        return;
      }
      this.submitting = true;
      const res = await fetch(`/api/threads/${this.id}/comments`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({text: this.newText})
      });
      const data = await res.json();
      if (data.error) {
        this.message = data.error;
      } else {
        const comment_id = data.id;
        //  highlight new comment
        location.href = `/threads/${this.id}?${comment_id}=primary`;
      }
      this.submitting = false;
    },
    getCommentClass(comment) {
      const cls = ["box"];
      if (comment.id in templates) {
        cls.push(`has-background-${templates[comment.id].template}-light`);
      }
      return cls;
    },
    async deleteThread() {
      const res = await fetch(`/api/threads/${this.id}`, {method: "DELETE"});
      const data = await res.json();
      if (data.error) {
        console.log(data.error);
      } else {
        this.$router.push("/");
      }
    },
  },
};

const Report = {
  template: "#report",
  data() {
    return {
      url: "",
      placeholder: `${location.origin}/threads/dae6e31c-2355-43f2-90bd-a5d30e42418e`,
      submitting: false,
      message: "",
    };
  },
  methods: {
    async report() {
      this.submitting = true;
      this.message = "";
      const res = await fetch(`/api/pow`, {method: "POST"});
      const data = await res.json();
      const task = data.task;
      const worker = new Worker("/pow.js");
      worker.onmessage = async e => {
        if (e.data.progress) {
          this.message = `Proofing of work... ${(e.data.progress*100).toFixed(2)} % of expected time\n`;
        }
        if (e.data.result) {
          this.message += "OK\n";
          this.message += "Submitting URL\n";
          this.message += "Wait a response\n";
          const res = await fetch(`/api/report`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
              pow: e.data.result,
              url: this.url,
            }),
          });
          const data = await res.json();
          this.message += "----\n";
          this.message += data.result;
          this.submitting = false;
        }
      };
      worker.postMessage(task);
    },
  },
};

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes: [
    {path: "/", component: Home},
    {path: "/threads/:id", component: Thread},
    {path: "/report", component: Report},
  ],
});

var app = Vue.createApp({});
app.use(router);
app.mount("#app");
