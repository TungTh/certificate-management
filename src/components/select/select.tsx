import React, { Component } from 'react';
import { Select, Button } from 'antd';
import './select.css';
import { downloadFile } from '../../libs/download';
import JSZip from 'jszip';
import { receiveMessageOnPort } from 'worker_threads';

const { Option } = Select;

interface ISection {
    id: number,
    name: string,
    proof: any[],
    revocationCheckHash: any[],
    image: any,
    mandatory: any
}

interface IState {
    sections: ISection[],
    sectionSelected: number[],
    receipt: any
}


class SelectAAA extends Component<any, IState> {

    state = {
        sections: [] as ISection[],
        sectionSelected: [] as number[],
        receipt: null as any
    }

    inputFile: any;

    onUpload = () => {
        this.inputFile.click();
    }

    onChangeInput = event => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
            let receipt = JSON.parse(e.target.result);
            const { sections } = receipt;
            this.setState({ sections: sections.filter(e => e.mandatory === 'false') });
            this.setState({ receipt: receipt })
        };
        reader.readAsText(event.target.files[0]);
    }

    onChangeSelect = sectionSelected => {
        this.setState({ sectionSelected });
    }

    onDownload = () => {
        const sectionSelected = this.state.sectionSelected;
        let receipt = this.state.receipt;

        if (receipt != null && sectionSelected.length) {
            console.log(sectionSelected, ' ===> id sectionSelected ');
            const fullSelectedSections = receipt.sections.filter(
                (s: ISection) => {
                    console.log(s);
                    return (sectionSelected.indexOf(s.id) > -1) || s.mandatory === 'true'

                });


            receipt.sections = fullSelectedSections;
            const selectiveReceipt = new Blob([JSON.stringify(receipt)], {
                type: 'json',
            });

            downloadFile(selectiveReceipt, 'SelectiveCert.json', 'json');

        }
    }

    render() {
        const { sections } = this.state;

        return (
            <React.Fragment>
                <input className='input-file' ref={(ref: any) => (this.inputFile = ref)} type='file' onChange={this.onChangeInput} />
                <div className='todoListMain'>
                    <Button type='primary' onClick={this.onUpload}>Upload</Button>
                    <Select
                        onChange={this.onChangeSelect}
                        style={{ width: 400 }}
                        mode="multiple"
                    >
                        {sections.map((e: any, index) => <Option key={index} value={e.id}>{e.name}</Option>)}
                    </Select>
                    <Button type='primary' onClick={this.onDownload}>DownLoad</Button>
                </div>
            </React.Fragment>
        )
    }
}

export default SelectAAA;

