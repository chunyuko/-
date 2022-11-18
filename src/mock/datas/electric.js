import Mock from "mockjs2";
import { builder } from "@/core/mock/util";

const info = (options) => {
  const data = [
    {
      id: "1",
      name: "02-1",
      title: "西面墙设备继电器",
      tag: "02",
      port: "1",
      type: "1",
      display: "1",
      delay_start: "",
      delay_end: "",
      style: "",
      offset_x: "",
      offset_y: "",
      scale: "",
      grouped: "1",
      description: "西面墙设备继电器",
      status: 0,
      time: "2022-04-27 04:00:00",
      avatar: "/images/light.png",
    },
    {
      id: "2",
      name: "03-1",
      title: "东面墙设备继电器",
      tag: "03",
      port: "1",
      type: "1",
      display: "1",
      delay_start: "",
      delay_end: "",
      style: "",
      offset_x: "",
      offset_y: "",
      scale: "",
      grouped: "0",
      description: "东面墙设备继电器",
      status: 1,
      time: "2022-04-27 04:00:00",
      avatar: "/images/light.png",
    },
    {
      id: "3",
      name: "03-2",
      title: "东面墙设备继电器",
      tag: "03",
      port: "2",
      type: "1",
      display: "1",
      delay_start: "",
      delay_end: "",
      style: "",
      offset_x: "",
      offset_y: "",
      scale: "",
      grouped: "1",
      description: "东面墙设备继电器",
      status: 2,
      time: "2022-04-27 04:00:00",
      avatar: "/images/light.png",
    },
    {
      id: "4",
      name: "03-3",
      title: "东面墙设备继电器",
      tag: "03",
      port: "3",
      type: "1",
      display: "1",
      delay_start: "",
      delay_end: "",
      style: "",
      offset_x: "",
      offset_y: "",
      scale: "",
      grouped: "0",
      description: "东面墙设备继电器",
      status: 3,
      time: "2022-04-27 04:00:00",
      avatar: "/images/light.png",
    },
    {
      id: "5",
      name: "03-3",
      title: "东面墙设备继电器",
      tag: "03",
      port: "3",
      type: "1",
      display: "1",
      delay_start: "",
      delay_end: "",
      style: "",
      offset_x: "",
      offset_y: "",
      scale: "",
      grouped: "0",
      description: "东面墙设备继电器",
      status: 3,
      time: "2022-04-27 04:00:00",
      avatar: "/images/light.png",
    },
    {
      id: "6",
      name: "03-3",
      title: "东面墙设备继电器",
      tag: "03",
      port: "3",
      type: "1",
      display: "1",
      delay_start: "",
      delay_end: "",
      style: "",
      offset_x: "",
      offset_y: "",
      scale: "",
      grouped: "0",
      description: "东面墙设备继电器",
      status: 3,
      time: "2022-04-27 04:00:00",
      avatar: "/images/light.png",
    },
    {
      id: "7",
      name: "03-3",
      title: "东面墙设备继电器",
      tag: "03",
      port: "3",
      type: "1",
      display: "1",
      delay_start: "",
      delay_end: "",
      style: "",
      offset_x: "",
      offset_y: "",
      scale: "",
      grouped: "1",
      description: "东面墙设备继电器",
      status: 3,
      time: "2022-04-27 04:00:00",
      avatar: "/images/light.png",
    },
    {
      id: "8",
      name: "03-3",
      title: "东面墙设备继电器",
      tag: "03",
      port: "3",
      type: "1",
      display: "1",
      delay_start: "",
      delay_end: "",
      style: "",
      offset_x: "",
      offset_y: "",
      scale: "",
      grouped: "1",
      description: "东面墙设备继电器",
      status: 3,
      time: "2022-04-27 04:00:00",
      avatar: "/images/light.png",
    },
    {
      id: "9",
      name: "03-3",
      title: "东面墙设备继电器",
      tag: "03",
      port: "3",
      type: "1",
      display: "1",
      delay_start: "",
      delay_end: "",
      style: "",
      offset_x: "",
      offset_y: "",
      scale: "",
      grouped: "0",
      description: "东面墙设备继电器",
      status: 3,
      time: "2022-04-27 04:00:00",
      avatar: "/images/light.png",
    },
    {
      id: "10",
      name: "08-1",
      title: "东面墙设备继电器",
      tag: "03",
      port: "1",
      type: "1",
      display: "1",
      delay_start: "",
      delay_end: "",
      style: "",
      offset_x: "",
      offset_y: "",
      scale: "",
      grouped: "0",
      description: "东面墙设备继电器",
      status: 3,
      time: "2022-04-27 04:00:00",
      avatar: "/images/light.png",
    },
    {
      id: "11",
      name: "04-5",
      title: "东面墙设备继电器",
      tag: "03",
      port: "3",
      type: "1",
      display: "1",
      delay_start: "",
      delay_end: "",
      style: "",
      offset_x: "",
      offset_y: "",
      scale: "",
      grouped: "0",
      description: "东面墙设备继电器",
      status: 3,
      time: "2022-04-27 04:00:00",
      avatar: "/images/light.png",
    },
    {
      id: "12",
      name: "05-5",
      title: "东面墙设备继电器",
      tag: "03",
      port: "3",
      type: "1",
      display: "1",
      delay_start: "",
      delay_end: "",
      style: "",
      offset_x: "",
      offset_y: "",
      scale: "",
      grouped: "0",
      description: "东面墙设备继电器",
      status: 3,
      time: "2022-04-27 04:00:00",
      avatar: "/images/light.png",
    },
  ];
  const result = { data, pageNo: 1, pageSize: 10, totalCount: 12, totalPage: 2 };
  return builder(result);
};

Mock.mock(/\/elec\/list/, "post", info);
