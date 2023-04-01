<template>
  <v-app>
    <v-app-bar>
      <v-container class="d-flex align-center py-0">
        <v-app-bar-title class="pl-0">
          <div class="d-flex align-center">Ribbon</div>
        </v-app-bar-title>
      </v-container>
    </v-app-bar>

    <v-main>
      <section id="hero">
        <v-sheet class="d-flex align-center pb-16" color="grey-darken-3">
          <v-container class="text-center">
            <v-responsive class="mx-auto">
              <h3 class="text-h3">Try Ribbon's all new features</h3>

              <p class="mt-4 text-medium-emphasis">
                Our all-in-one platform gives you the banking, accounting,
                fundraising, and organizational tools you need to build a
                successful charity under the umbrella of your fiscal sponsor.
              </p>
            </v-responsive>
          </v-container>
        </v-sheet>
      </section>

      <v-sheet>
        <section id="filter">
          <v-container>
            <v-row justify="space-between">
              <v-col cols="auto">
                <h2 class="text-h4">Ribbon Donor List</h2>

                <p class="text-primary mt-3">In Beta now!</p>

                <p class="mt-3">See all those that have given in one place!</p>
              </v-col>
              <v-row justify="space-between">
                <v-col class="text-right" cols="col-12">
                  <v-btn class="new-form-btn" depressed> NEW FORM </v-btn>
                </v-col>
              </v-row>
            </v-row>
            <!-- <v-card color="grey-lighten-3"> -->
            <v-row justify="space-between">
              <v-col class="text-right" cols="col-12">
                <v-card color="grey-lighten-3" max-width="400" height="80">
                  <v-card-text>
                    <v-text-field
                      v-model="search"
                      density="compact"
                      variant="solo"
                      label="Search by name"
                      append-inner-icon="mdi-magnify"
                      single-line
                      hide-details
                    ></v-text-field>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
            <v-row>
              <v-col v-if="donors">
                <v-data-table
                  :headers="headers"
                  :items="donors.data"
                  :search="search"
                  :footer-props="{
                    'items-per-page-options': [5, 10, 20, 30, 40, 50],
                  }"
                  :items-per-page="5"
                  class="elevation-1"
                >
                  <template v-slot:item="{ item }">
                    <tr class="hover-bg">
                      <td>{{ item.full_name }}</td>
                      <td>{{ item.email }}</td>
                      <td>{{ item.first_donation | myDate }}</td>
                      <td>{{ item.total_donations }}</td>
                    </tr>
                  </template>
                  <template v-slot:item.first_donation="{ item }">
                    <span>{{ item.first_donation | myDate }}</span>
                  </template>

                  <template v-slot:header.name="{ header }">
                    {{ header.text.toUpperCase() }}
                  </template>
                </v-data-table>

                <!-- <table v-if="donors">
                  <thead>
                    <tr>
                      <th class="text-left">Name</th>
                      <th class="text-left">Email</th>
                      <th class="text-left">Total Donations</th>
                      <th class="text-left">First Donation</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="item in donors.data"
                      :key="item.id"
                    >
                      <td>{{ item.full_name }}</td>
                      <td>{{ item.email }}</td>
                      <td>{{ item.total_donations }}</td>
                      <td>{{ item.first_donation | myDate}}</td>
                      </tr>
                  </tbody>
                </table> -->
              </v-col>
            </v-row>
            <!-- </v-card> -->
          </v-container>
        </section>
      </v-sheet>

      <v-sheet class="py-16" color="#1818181a">
        <section id="grid">
          <v-container>
            <v-row justify="space-between">
              <v-col cols="auto">
                <v-responsive width="350">
                  <h2 class="text-h4">Show your support feature</h2>
                  <p class="text-success mt-3">Available now!</p>
                  <p class="mt-3">
                    Easily send messages to those that have given!
                  </p>
                </v-responsive>
              </v-col>
              <v-sheet width="400" class="mx-auto">
                <v-form
                  v-model="valid"
                  validate-on="submit"
                  @submit.prevent="submit"
                >
                  <v-textarea
                    v-model="message"
                    :rules="messageRules"
                    label="Message"
                  ></v-textarea>
                  <v-col v-if="donors">
                    <v-layout row wrap>
                      <v-flex md12 xs12>
                        <v-select
                          label="Email"
                          v-model="email"
                          :rules="emailRules"
                          :items="donors.data"
                          :closeOnSelect="true"
                          return-object
                          @change="handleEmailSelect"
                          attach
                          item-text="email"
                          item-value="id"
                        ></v-select>
                      </v-flex>
                    </v-layout>
                  </v-col>
                  <!-- <v-text-field
                    v-model="email"
                    :rules="emailRules"
                    label="Email"
                  ></v-text-field> -->
                  <v-text-field
                    v-model="donor_id"
                    label="Donor Id"
                  ></v-text-field>
                  <v-btn type="submit" block class="mt-2">Send</v-btn>
                </v-form>
              </v-sheet>
            </v-row>
          </v-container>
        </section>
      </v-sheet>
    </v-main>

    <v-footer>
      <v-container
        class="text-overline d-flex align-center justify-space-between"
      >
        <div>Copyright &copy; 2023 Flourish Change Inc dba Ribbon</div>

        <v-icon icon="mdi-bank" size="x-large" />
      </v-container>
    </v-footer>
  </v-app>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
export default {
  name: "App",

  data() {
    return {
      headers: [
        {
          text: "NAME",
          align: "start",
          value: "full_name",
          width: "20%",
        },
        {
          text: "EMAIL",
          value: "email",
        },
        {
          text: "TOTAL DONATIONS",
          value: "total_donations",
        },
        {
          text: "FIRST DONATIONS",
          value: "first_donation",
        },
      ],
      search: "",
      pagination: {
        rowsPerPage: 5,
      },
      donors: null,
      valid: false,
      email: "",
      selectedUserObject: {},
      donor_id: "",
      message: "",
      emailRules: [
        (value) => {
          if (value) return true;

          return "E-mail is required.";
        },
      ],
      messageRules: [
        (value) => {
          if (value) return true;

          return "Message is required.";
        },
      ],
    };
  },
  mounted() {
    axios
      .get("https://interview.ribbon.giving/api/donors")
      .then((response) => (this.donors = response.data));
  },
  methods: {
    resetFormSate() {
      this.donor_id = "";
      this.email = "";
      this.message = "";
    },
    async submit() {
      if (this.message.length < 15) {
        Swal.fire(
          "<p style='font-size: 14px;'>Message should be more than 15 characters</p>",
          "",
          "error"
        );
        return;
      }
      if (this.donor_id != "" || this.donor_id != undefined) {
        let url =
          "https://interview.ribbon.giving/api/donors/" +
          this.donor_id +
          "/send-message";

        let formData = {
          donor_id: this.donor_id,
          message: this.message,
          email: this.selectedUserObject.email,
        };

        // Send message to server.

        axios({
          method: "POST",
          url: url,
          data: formData,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
          .then((res) => {
            //reset states
            this.resetFormSate();
            Swal.fire({
              icon: "success",
              title: "Success",
              html: "<p class='font-size: 13px'>Donor Message Successfully Submitted</p>",
              showConfirmButton: true,
              allowOutsideClick: false,
              showCloseButton: true,
              confirmButtonText: "Ok",
              confirmButtonColor: "#32CD32",
            }).then((result) => {
              if (result.isConfirmed) {
              }
            });
          })
          .catch((error) => {
            console.log("ERROR: ", error);

            if (error.response) {
              Swal.fire(
                "<p style='font-size: 14px;'>Error Occured</p>",
                eerror.response,
                "error"
              );
            }
            this.resetFormSate();
          });
      }
    },

    handleEmailSelect(e) {
      this.donor_id = e.id;
      this.selectedUserObject = e;
    },

    customFilter(items, search, filter) {
      search = search.toString().toLowerCase();
      return items.filter((row) => filter(row["type"], search));
    },
  },
};
</script>

<style scoped>
::v-deep .v-data-table-header {
  color: rgba(58, 58, 64, 0.87);
  background-color: rgba(58, 58, 64, 0.05);
}

.hover-bg {
  display: table-row;
}
.hover-bg:hover {
  background: rgba(58, 58, 64, 0.03) !important;
}

.new-form-btn {
  background: #00754a !important;
  color: #fff;
}
</style>
