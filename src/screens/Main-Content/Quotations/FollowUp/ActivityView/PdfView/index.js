import React, { useEffect, useContext, useState } from 'react'
import { StyleSheet, View, Dimensions, Linking, KeyboardAvoidingView, Platform } from 'react-native'
import { Text, ButtonGroup, Input, Button } from "react-native-elements"
import Icon from 'react-native-vector-icons/FontAwesome';
import { Table, TableWrapper, Row, Rows } from 'react-native-table-component';
import moment from "moment"
import { ScrollView, TouchableOpacity, TextInput } from 'react-native-gesture-handler';
import DatePicker from 'react-native-datepicker';
import { Dropdown } from 'react-native-material-dropdown';
import { WebView } from "react-native-webview"
import Axios from 'axios';
import PDFView from 'react-native-view-pdf';

const styles = StyleSheet.create({

  topContainer: {
    height: "100%"
  },
})


const PdfView = (props) => {

  const [pdfURL, setPDFUrl] = useState('')

  useEffect(() => {
    let idCardBase64 = '';
    getBase64(props.route.params.uri, (result) => {
      setPDFUrl(result)
      console.log("object", result)
    });
  }, [])

  const getBase64 = (file, cb) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => cb(reader.result));
    reader.readAsDataURL(file);
  }

  return (
    <View style={{ height: '100%' }}>
      <PDFView
        fadeInDuration={250.0}
        style={{ flex: 1 }}
        resource={pdfURL}
        resourceType={'base64'}
        onLoad={() => console.log(`PDF rendered from ${'base64'}`)}
        onError={(error) => console.log('Cannot render PDF', error)}
      />
    </View>
  )
}
export default PdfView