import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  Collapse,
  IconButton,
  TableHead,
  Box,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { KeyboardArrowUp, KeyboardArrowDown } from '@material-ui/icons';
import * as React from 'react';
import { Pipeline } from '../service/model';

interface Props {
  pipeline: Pipeline;
}

interface RowProps {
  row: any;
  transformationOptions: any[];
}

interface RowState {
  open: boolean;
}

const properties = [
  {
    name: 'state',
    label: 'Status',
  },
  {
    name: 'createTime',
    label: 'Created',
  },
  {
    name: 'trainBudgetMilliNodeHours',
    label: 'Budget',
  },
  {
    name: 'budgetMilliNodeHours',
    label: 'Budget',
  },
  {
    name: 'elapsedTime',
    label: 'Elapsed Time',
  },
  {
    name: 'datasetId',
    label: 'Dataset ID',
  },
  {
    name: 'targetColumn',
    label: 'Target column',
  },
  {
    name: 'transformationOptions',
    label: 'Transformation options',
  },
  {
    name: 'objective',
    label: 'Objective',
  },
  {
    name: 'optimizationObjective',
    label: 'Optimized for',
  },
];

export class TransformationOptionsRow extends React.Component<
  RowProps,
  RowState
> {
  constructor(props: RowProps) {
    super(props);
    this.state = {
      open: false,
    };
  }

  render() {
    return (
      <React.Fragment key={'Expandable'}>
        <TableRow key={this.props.row.key}>
          <TableCell component="th" scope="row">
            {this.props.row.key}
          </TableCell>
          <TableCell align="right">
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => {
                this.setState({ open: !this.state.open });
              }}
            >
              {this.state.open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          </TableCell>
        </TableRow>
        <TableRow key={'Collapse'}>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={this.state.open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Column name</TableCell>
                      <TableCell>Transformation</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.props.transformationOptions.map(option => (
                      <TableRow key={option.columnName}>
                        <TableCell component="th" scope="row">
                          {option.columnName}
                        </TableCell>
                        <TableCell>{option.dataType}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }
}

export class PipelineProperties extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  private getBudget(milliNodeHours: number): string {
    return (milliNodeHours / 1000).toString() + ' node hours';
  }

  private createData(key: string, val: any) {
    return { key, val };
  }

  private getPipelineDetails(pipeline: Pipeline): any[] {
    const pipelineID = pipeline.id.split('/');
    const pipelineDetails = [
      this.createData('ID', pipelineID[pipelineID.length - 1]),
      this.createData('Region', 'us-central1'),
    ];
    for (let i = 0; i < properties.length; i++) {
      const property = properties[i]['name'];
      const label = properties[i]['label'];
      if (pipeline[property]) {
        if (
          property === 'trainBudgetMilliNodeHours' ||
          property === 'budgetMilliNodeHours'
        ) {
          pipelineDetails.push(
            this.createData(label, this.getBudget(pipeline[property]))
          );
        } else if (property === 'createTime') {
          pipelineDetails.push(
            this.createData(label, pipeline[property].toLocaleString())
          );
        } else {
          pipelineDetails.push(this.createData(label, pipeline[property]));
        }
      }
    }
    return pipelineDetails;
  }

  render() {
    return (
      <>
        {this.props.pipeline.error && (
          <Alert severity="error">
            Training failed with message: {this.props.pipeline.error}
          </Alert>
        )}
        <Table size="small" style={{ width: 500 }}>
          <TableBody>
            {this.getPipelineDetails(this.props.pipeline).map(row =>
              row.key === 'Transformation options' ? (
                <TransformationOptionsRow
                  row={row}
                  transformationOptions={
                    this.props.pipeline.transformationOptions
                  }
                  key={row.key}
                />
              ) : (
                <TableRow key={row.key}>
                  <TableCell component="th" scope="row">
                    {row.key}
                  </TableCell>
                  <TableCell align="right">{row.val}</TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </>
    );
  }
}
