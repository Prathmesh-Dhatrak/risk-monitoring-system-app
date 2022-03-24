import React, { useEffect, useState } from "react";
import { View, Linking } from "react-native";
import {
  Layout,
  Button,
  Text,
  Section,
  SectionContent,
  useTheme,
} from "react-native-rapi-ui";
import ReactNativeAN from "react-native-alarm-notification";

export default function ({ navigation }) {
  const { isDarkmode, setTheme } = useTheme();
  // const [data, setData] = useState();
  const [temperature, setTemperature] = useState();
  const [humidity, setHumidity] = useState();
  const [airPressure, setAirPressure] = useState();
  const [altitude, setAltitude] = useState();
  const [time, setTime] = useState();
  const [SOSValue, setSOSValue] = useState();
  const [GPS, setGPS] = useState();
  async function getdata() {
    try {
      // https://api.thingspeak.com/channels/935349/fields/1.json?results=1
      let response = await fetch(
        "https://api.thingspeak.com/channels/935349/fields/1.json?results=1"
      );
      let responseJson = await response.json();
      let x = await responseJson["feeds"];
      let y = await x[0];
      console.log(y["field1"]);
      setTemperature(y["field1"]);
      return responseJson;
    } catch (error) {
      console.error(error);
    }
  }
  const handleButtonPress = () => {
    LocalNotification();
  };
  async function method() {
    console.log("Alarm test start");

    const fireDate = ReactNativeAN.parseDate(new Date(Date.now() + 10000));

    const alarmNotifData = {
      title: "My Notification Title",
      message: "My Notification Message",
      channel: "my_channel_id",
      small_icon: "../icon.png",
      scheduleType: "once",

      data: { foo: "bar" },
      fire_date: fireDate,
    };

    const alarm = await ReactNativeAN.scheduleAlarm({ ...alarmNotifData });

    console.log("Alarm test finish");
  }

  useEffect(() => {
    getdata();
    method();
  });
  return (
    <Layout>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Section
          style={{
            marginVertical: 20,
            width: "90%",
          }}
        >
          <SectionContent>
            <Text fontWeight="bold" style={{ textAlign: "center" }}>
              Risk monitoring System {temperature}
            </Text>
            <Button
              style={{ marginTop: 10 }}
              text="Rapi UI Documentation"
              status="info"
              onPress={() => method()}
            />
            <Button
              text="Go to second screen"
              // onPress={() => {
              //   navigation.navigate("SecondScreen");
              // }}
              onPress={handleButtonPress}
              style={{
                marginTop: 10,
              }}
            />

            <Button
              text={isDarkmode ? "Light Mode" : "Dark Mode"}
              status={isDarkmode ? "success" : "warning"}
              onPress={() => {
                if (isDarkmode) {
                  setTheme("light");
                } else {
                  setTheme("dark");
                }
              }}
              style={{
                marginTop: 10,
              }}
            />
          </SectionContent>
        </Section>
      </View>
    </Layout>
  );
}
