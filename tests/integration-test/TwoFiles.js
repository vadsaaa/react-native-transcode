import React from 'react';
import ReactNative from 'react-native';
import LoggingTestModule from './LoggingTestModule';
import Transcode from '../copies/Transcode';
import AbstractTest from './AbstractTest';
import RNFetchBlob from 'react-native-fetch-blob'
const { fs, fetch, wrap } = RNFetchBlob

import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet
} from 'react-native';

const invariant = require('fbjs/lib/invariant');
import Video from 'react-native-video';

class TwoFiles extends AbstractTest {

    constructor(props) {
        super(props);
    }

    async testBody(progressCallback) {

        var poolCleanerInputFile = await this.prepFile('poolcleaner.mp4');
        var outputFile = fs.dirs.DocumentDir + '/output_' + TwoFiles.displayName + '.mp4';
        try {RNFetchBlob.fs.unlink(outputFile)}catch(e){};

        var status = await Transcode.start()
            .asset({name: "A", path: poolCleanerInputFile})
            .asset({name: "B", path: poolCleanerInputFile})

            .segment()
                .track({asset: "A"})

            .segment()
                .track({asset: "B"})

            .process("low", outputFile, (progress)=>{progressCallback(progress)});

        LoggingTestModule.assertEqual('Finished', status);
        LoggingTestModule.assertEqual((await RNFetchBlob.fs.stat(outputFile)).size > 0, true);
    }
};

TwoFiles.displayName = 'TwoFiles';

module.exports = TwoFiles;
