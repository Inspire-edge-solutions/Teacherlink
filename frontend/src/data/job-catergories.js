import { MdScience, MdSchool, MdCastForEducation } from "react-icons/md";
import { FaChalkboardTeacher, FaGraduationCap, FaBook } from "react-icons/fa";
import { IoMdSchool } from "react-icons/io";
import { GiTeacher } from "react-icons/gi";
import { SiGoogleclassroom } from "react-icons/si";

const jobCategories = [
  {
    id: 1,
    icon: MdScience,
    catTitle: "NEET Faculty",
    jobNumber: "2",
  },
  {
    id: 2,
    icon: SiGoogleclassroom,
    catTitle: "school teacher",
    jobNumber: "86",
  },
  {
    id: 3,
    icon: FaChalkboardTeacher,
    catTitle: "High school teacher",
    jobNumber: "43"
  },
  {
    id: 4,
    icon: MdCastForEducation,
    catTitle: "CET Faculty",
    jobNumber: "12",
  },
  {
    id: 5,
    icon: GiTeacher,
    catTitle: "Lecturer",
    jobNumber: "55",
  },
  {
    id: 6,
    icon: FaBook,
    catTitle: "JEE Faculty",
    jobNumber: "2",
  },
  {
    id: 7,
    icon: IoMdSchool,
    catTitle: "Nursery Teacher",
    jobNumber: "2",
  },
  {
    id: 8,
    icon: MdSchool,
    catTitle: "PUC Faculty",
    jobNumber: "25",
  },
  {
    id: 9,
    icon: FaGraduationCap,
    catTitle: "Montessori Teacher",
    jobNumber: "92",
  },
];

export default jobCategories